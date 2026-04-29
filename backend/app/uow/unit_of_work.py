from sqlmodel import Session

class UnitOfWork:
    def __init__(self, session: Session):
        self.session = session

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.rollback()

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
