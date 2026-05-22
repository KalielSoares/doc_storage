class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class NotFoundedError(AppError):
    def __init__(self, resource: str):
        super().__init__(f"não_encontrada",f"{resource} Not founded",404)

class InvalidInputError(AppError):
    def __init__(self, resource: str):
        super().__init__(f"entrada_invalida",f"input {resource} invalid", 400)

class ExeedLimitError(AppError):
    def __init__(self):
        super().__init__(f"tamanho_invalido","File size exceed limit",413)        