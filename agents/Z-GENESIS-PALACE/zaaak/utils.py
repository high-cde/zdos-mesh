def chunk(text: str, size: int = 256):
    for i in range(0, len(text), size):
        yield text[i:i+size]
