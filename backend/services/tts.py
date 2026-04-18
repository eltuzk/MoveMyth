"""
Service wrapper for Gemini Text-to-Speech API using google-genai.
"""

import io
import wave
from google import genai
from google.genai import types

async def generate_speech(text: str) -> bytes:
    """
    Calls Gemini API to convert text to speech and returns the WAV audio bytes.
    Raises an exception if the API call fails.
    """
    try:
        # Client initializes automatically reading GEMINI_API_KEY from env
        client = genai.Client()

        response = client.models.generate_content(
            model="gemini-3.1-flash-tts-preview",
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name="Kore"
                        )
                    )
                )
            )
        )

        if not response.candidates:
            raise Exception("No candidates returned from Gemini TTS")

        pcm_data = response.candidates[0].content.parts[0].inline_data.data

        # Wrap raw PCM into standard WAV container
        wav_io = io.BytesIO()
        with wave.open(wav_io, 'wb') as wav_file:
            wav_file.setnchannels(1)      # 1 channel (mono)
            wav_file.setsampwidth(2)      # 2 bytes (16-bit)
            wav_file.setframerate(24000)  # 24000 Hz sample rate
            wav_file.writeframes(pcm_data)

        return wav_io.getvalue()
    except Exception as e:
        raise Exception(f"Failed to generate speech: {str(e)}") from e
