import os
import tempfile
from google import genai

async def transcribe_audio(audio_bytes: bytes, mime_type: str) -> str:
    """
    Transcribes audio using Gemini 2.5 Flash.
    Must use File API to upload the audio first.
    """
    client = genai.Client()
    
    ext = ".webm" if "webm" in mime_type else ".wav"
    fd, temp_path = tempfile.mkstemp(suffix=ext)
    
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(audio_bytes)
            
        uploaded_file = client.files.upload(file=temp_path)
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[
                    uploaded_file,
                    "Transcribe the following audio. Return only the transcribed text, no other text or explanation. If it is a name, output the name clearly."
                ]
            )
            return response.text.strip()
        finally:
            try:
                client.files.delete(name=uploaded_file.name)
            except Exception:
                pass
    except Exception as e:
        raise
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
