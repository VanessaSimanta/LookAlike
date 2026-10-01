class InvalidImageError(Exception):
    def __init__(self, message: str = "File yang diupload bukan gambar yang valid"):
        self.message = message
        super().__init__(message)