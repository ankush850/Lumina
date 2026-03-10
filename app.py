import glob
import os
import tempfile
import time
import logging
from fastapi import FastAPI, File, UploadFile, Request, BackgroundTasks, Header, Depends, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.exceptions import HTTPException as StarletteHTTPException
from werkzeug.utils import secure_filename
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from utils.file_helpers import allowed_file, get_file_extension
from utils.processors import PDFProcessor, PPTXProcessor

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create necessary directories
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), "uploads")
OUTPUT_FOLDER = os.path.join(tempfile.gettempdir(), "outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = FastAPI(title="Gamma AI Watermark Remover", version="2.3.0")

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize processors
pdf_processor = PDFProcessor()
pptx_processor = PPTXProcessor()

# Security: 50MB limit
MAX_FILE_SIZE = 50 * 1024 * 1024

async def valid_content_length(content_length: int = Header(..., description="The size of the request body in bytes")):
    if content_length > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large. Maximum size allowed is 50MB.")
    return content_length

def cleanup_old_files(max_age_seconds: int = 3600):
    """Delete files in uploads/ outputs/ older than max_age_seconds."""
    now = time.time()
    for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
        for filepath in glob.glob(os.path.join(folder, "*")):
            try:
                if os.path.isfile(filepath):
                    if os.stat(filepath).st_mtime < now - max_age_seconds:
                        os.remove(filepath)
            except Exception as e:
                logger.error(f"Error cleaning up {filepath}: {e}")


@app.get("/", response_class=HTMLResponse)
async def landing(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse('static/favicon.svg')

@app.get("/landing.html", response_class=HTMLResponse)
async def landing_alias(request: Request):
    return templates.TemplateResponse("landing.html", {"request": request})

@app.get("/index.html", response_class=HTMLResponse)
async def tool_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/about.html", response_class=HTMLResponse)
async def about_page(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})

@app.post("/remove_watermark")
async def remove_watermark(
    request: Request, 
    background_tasks: BackgroundTasks, 
    pdf_file: UploadFile = File(...),
    content_length: int = Depends(valid_content_length)
):
    """
    Remove watermarks from PDF or PPTX files.
    The parameter is named 'pdf_file' for backward compatibility with the form.
    """
    background_tasks.add_task(cleanup_old_files)
    if not pdf_file.filename:
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": "No file selected. Please choose a PDF or PPTX file.",
            },
        )

    if not allowed_file(pdf_file.filename):
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": "Invalid file type. Please upload a PDF or PowerPoint (.pptx) file.",
            },
        )

    # Extract extension before secure_filename to handle Unicode filenames
    original_extension = get_file_extension(pdf_file.filename)
    filename = secure_filename(pdf_file.filename)

    # If secure_filename stripped the extension (e.g., Cyrillic names), restore it
    if not get_file_extension(filename) and original_extension:
        # Generate a safe filename with preserved extension
        import uuid

        filename = f"{uuid.uuid4().hex[:8]}.{original_extension}"

    file_extension = get_file_extension(filename)

    logger.info(
        f"Processing file: {filename} (original: {pdf_file.filename}, type: {file_extension})"
    )

    # Additional validation: ensure we have a valid extension
    if not file_extension:
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "error_message": "Invalid file name. Please upload a file with a proper extension (.pdf or .pptx).",
            },
        )

    # Create temp file with appropriate extension
    with tempfile.NamedTemporaryFile(
        delete=False, suffix=f".{file_extension}"
    ) as temp_input:
        upload_path = temp_input.name

        try:
            content = await pdf_file.read()
            temp_input.write(content)
            temp_input.flush()

            # Dispatch to appropriate handler based on file type
            if file_extension == "pdf":
                return await _process_pdf(request, upload_path, filename)
            elif file_extension == "pptx":
                return await _process_pptx(request, upload_path, filename)
            else:
                return templates.TemplateResponse(
                    "index.html",
                    {
                        "request": request,
                        "error_message": f"Unsupported file type: {file_extension}",
                    },
                )

        except Exception as e:
            logger.error(f"Error processing file: {str(e)}")
            return templates.TemplateResponse(
                "index.html",
                {
                    "request": request,
                    "error_message": f"Error processing file: {str(e)}",
                },
            )

        finally:
            try:
                os.unlink(upload_path)
            except Exception:
                pass


async def _process_pdf(request: Request, upload_path: str, filename: str):
    """Process a PDF file for watermark removal."""
    output_filename = f"processed_{filename}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    result = pdf_processor.process(upload_path, output_path, filename)

    if not result["success"]:
        raise Exception(result["error"])

    template_data = {"request": request, "success_message": result["message"]}
    if "stats" in result and isinstance(result["stats"], dict):
        template_data["stats"] = result["stats"]

    if result["has_watermark"]:
        template_data["download_filename"] = output_filename
        template_data["file_type"] = "pdf"

    return templates.TemplateResponse("index.html", template_data)


async def _process_pptx(request: Request, upload_path: str, filename: str):
    """Process a PPTX file for watermark removal."""
    output_filename = f"processed_{filename}"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    result = pptx_processor.process(upload_path, output_path, filename)

    if not result["success"]:
        raise Exception(result["error"])

    template_data = {"request": request, "success_message": result["message"]}
    if "stats" in result and isinstance(result["stats"], dict):
        template_data["stats"] = result["stats"]

    if result["has_watermark"]:
        template_data["download_filename"] = output_filename
        template_data["file_type"] = "pptx"

    return templates.TemplateResponse("index.html", template_data)

@app.post("/api/remove-watermark")
async def api_remove_watermark(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...),
    content_length: int = Depends(valid_content_length)
):
    background_tasks.add_task(cleanup_old_files)
    import shutil
    if not file.filename or not allowed_file(file.filename):
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": "Invalid file. Upload a PDF or PPTX."},
        )
    original_extension = get_file_extension(file.filename)
    safe_name = secure_filename(file.filename)
    if not get_file_extension(safe_name) and original_extension:
        import uuid
        safe_name = f"{uuid.uuid4().hex[:8]}.{original_extension}"
    ext = get_file_extension(safe_name)
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_input:
            upload_path = temp_input.name
            file.file.seek(0)
            shutil.copyfileobj(file.file, temp_input)
        output_filename = f"processed_{safe_name}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        if ext == "pdf":
            result = pdf_processor.process(upload_path, output_path, safe_name)
            if not result["success"]:
                return JSONResponse(status_code=500, content={"status": "error", "message": result["error"]})
            stats = result.get("stats", {})
            response = {
                "status": "success",
                "file_type": "pdf",
                "layouts_processed": 0,
                "watermarks_removed": stats.get("total_removed", 0),
            }
        elif ext == "pptx":
            result = pptx_processor.process(upload_path, output_path, safe_name)
            if not result["success"]:
                return JSONResponse(status_code=500, content={"status": "error", "message": result["error"]})
            stats = result.get("stats", {})
            response = {
                "status": "success",
                "file_type": "pptx",
                "layouts_processed": stats.get("layouts_cleaned", 0),
                "watermarks_removed": stats.get("watermarks_removed", 0),
            }
        else:
            return JSONResponse(status_code=400, content={"status": "error", "message": "Unsupported file type"})
        if result.get("has_watermark"):
            response["download_url"] = f"/download/{output_filename}"
        else:
            response["message"] = "No Gamma watermarks detected"
        return JSONResponse(content=response)
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})
    finally:
        try:
            os.unlink(upload_path)
        except Exception:
            pass

# ===========================
# DOWNLOAD ENDPOINT
# ===========================
@app.get("/download/{filename}")
async def download_processed_file(filename: str):
    from fastapi.responses import FileResponse

    file_path = os.path.join(OUTPUT_FOLDER, filename)

    if not os.path.exists(file_path):
        return {"error": "File not found."}

    # Determine MIME type based on file extension
    from utils.file_helpers import get_mime_type

    file_extension = get_file_extension(filename)
    mime_type = get_mime_type(file_extension)

    return FileResponse(file_path, media_type=mime_type, filename=filename)


# ===========================
# ERROR HANDLERS
# ===========================
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return templates.TemplateResponse(
            "index.html",
            {"request": request, "error_message": "Page not found."},
            status_code=404,
        )
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "error_message": f"Server error: {exc.detail}"},
        status_code=exc.status_code,
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "error_message": f"Internal server error: {str(exc)}"},
        status_code=500,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8999)
