from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import logging
import vectordatabase

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (adjust origins as needed for security)

# Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Absolute path to the current directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploaded_files')  # Absolute path to 'uploaded_files' directory
ALLOWED_EXTENSIONS = {'pdf'}  # Allowed file extensions

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size: 16MB

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    try:
        os.makedirs(UPLOAD_FOLDER)
        logger.info(f"Created upload directory at {UPLOAD_FOLDER}")
    except Exception as e:
        logger.error(f"Failed to create upload directory: {e}")
        raise

# Check if the upload folder is writable
if not os.access(UPLOAD_FOLDER, os.W_OK):
    raise PermissionError(f"Upload folder '{UPLOAD_FOLDER}' is not writable.")

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
def shorten_filename(filename, max_length=25):
    """
    Shortens the filename if it exceeds the max_length.
    Preserves the file extension.

    Args:
        filename (str): The original filename.
        max_length (int): The maximum allowed length for the filename.

    Returns:
        str: The shortened filename if necessary, else the original filename.
    """
    if len(filename) <= max_length:
        return filename

    name, ext = os.path.splitext(filename)
    ext_length = len(ext)

    # Reserve space for ellipsis and extension
    allowed_length = max_length - ext_length - 3  # 3 for '...'

    if allowed_length <= 0:
        # If extension itself is longer than max_length, truncate it
        return ext[:max_length]

    shortened_name = name[:allowed_length] + '...'
    return shortened_name + ext


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to handle file uploads.
    Expects a form-data with a file field named 'file'.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            file.save(save_path)
            vectordatabase()
            logger.info(f"File '{shorten_filename(filename)}' successfully uploaded.")
            return jsonify({'message': f'File {shorten_filename(filename)} successfully uploaded'}), 201
        except Exception as e:
            logger.error(f"Failed to save file '{filename}': {e}")
            return jsonify({'error': f'Failed to save file: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Allowed file types are pdf'}), 400

@app.route('/files', methods=['GET'])
def list_files():
    """
    Optional: Endpoint to list all uploaded files.
    """
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        # Optionally, filter files by allowed extensions
        files = [f for f in files if allowed_file(f)]
        logger.info("Listed uploaded files.")
        return jsonify({'files': files}), 200
    except Exception as e:
        logger.error(f"Failed to list files: {e}")
        return jsonify({'error': f'Failed to list files: {str(e)}'}), 500

@app.route('/clear', methods=['DELETE'])
def clear_files():
    """
    Endpoint to delete all files in the 'uploaded_files' directory.
    """
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        if not files:
            logger.info("No files to delete.")
            return jsonify({'message': 'No files to delete.'}), 200

        deleted_files = []
        for f in files:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], f)
            if os.path.isfile(file_path):
                try:
                    os.remove(file_path)
                    vectordatabase()
                    deleted_files.append(f)
                    logger.info(f"Deleted file: {f}")
                except Exception as e:
                    logger.error(f"Failed to delete file '{f}': {e}")
                    return jsonify({'error': f'Failed to delete file {f}: {str(e)}'}), 500
            else:
                logger.warning(f"Skipped non-file entry: {f}")

        return jsonify({'message': f"Successfully deleted {len(deleted_files)} file(s).", 'deleted_files': deleted_files}), 200

    except Exception as e:
        logger.error(f"Error clearing files: {e}")
        return jsonify({'error': f'Error clearing files: {str(e)}'}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    chat_message = data.get('message', '')
    logging.info(f"Received chat message: {chat_message}")
    
    # Simulate a multi-paragraph response
    response_text = (
        "Certainly! I'm here to help you with your queries.\n\n"
        "Feel free to ask me anything about file uploads, downloads, or chat functionalities. "
        "I'll do my best to provide clear and concise answers to assist you.\n\n"
        "If you have any specific requirements or need further assistance, just let me know!"
    )
    
    # In a real-world scenario, integrate with an AI model like Llama-3 here
    
    response = {
        'reply': response_text
    }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(debug=True)
