from sqlmodel import Session

class UnitOfWork:
    """
    Patrón Unit of Work que actúa como un context manager para garantizar 
    la atomicidad de las transacciones (ACID).
    """
    def __init__(self, session: Session):
        self.session = session

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            # Si hubo una excepción, deshacer cambios
            self.rollback()
        # Nota: El commit se suele dejar explícito en el servicio para tener control total,
        # pero también se puede automatizar aquí si no hay error.

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()

    def refresh(self, instance):
        self.session.refresh(instance)

    def add(self, instance):
        self.session.add(instance)
        return instance

    def delete(self, instance):
        self.session.delete(instance)

    def flush(self):
        self.session.flush()
