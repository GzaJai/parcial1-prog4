import random
from sqlmodel import Session, text
from database import engine
from models import Categoria, Ingrediente, Producto

def seed_data():
    print("\n[SEED] Reiniciando base de datos para carga masiva (+25 registros)...")
    with Session(engine) as session:
        try:
            # 1. Limpieza total
            session.execute(text("TRUNCATE categoria, ingrediente, producto RESTART IDENTITY CASCADE;"))
            session.commit()
            print("[SEED] Base de datos limpia.")

            # 2. Crear 25 Ingredientes
            nombres_ing = [
                "Muzarella", "Jamón", "Aceitunas", "Cebolla", "Pimiento", "Pepperoni", "Pollo", "Bacon",
                "Huevo", "Lechuga", "Tomate", "Pepinos", "Cheddar", "Roquefort", "Parmesano", "Salsa BBQ",
                "Mayonesa", "Ketchup", "Mostaza", "Ajo", "Orégano", "Champiñones", "Salame", "Rúcula", "Panceta"
            ]
            ingredientes = []
            for nombre in nombres_ing:
                ing = Ingrediente(nombre=nombre, descripcion=f"Ingrediente: {nombre}")
                # Marcar algunos como alérgenos por el nombre
                if any(x in nombre.lower() for x in ["queso", "cheddar", "parmesano", "roquefort", "muzarella"]):
                    ing.es_alergeno = True
                ingredientes.append(ing)
            
            session.add_all(ingredientes)
            session.commit()
            print(f"[SEED] {len(ingredientes)} ingredientes creados.")

            # 3. Crear 25 Categorías
            nombres_cat = [
                "Pizzas", "Hamburguesas", "Bebidas", "Postres", "Ensaladas", "Pastas", "Carnes", 
                "Minutas", "Entradas", "Sandwiches", "Vinos", "Cervezas", "Tragos", "Cafetería", 
                "Desayunos", "Meriendas", "Papas Fritas", "Empanadas", "Tartas", "Pollos",
                "Salsas", "Aderezos", "Guarniciones", "Opciones Veganas", "Sin TACC"
            ]
            categorias = []
            for nombre in nombres_cat:
                cat = Categoria(nombre=nombre, descripcion=f"Especialidad en {nombre}")
                categorias.append(cat)
            
            session.add_all(categorias)
            session.commit()
            print(f"[SEED] {len(categorias)} categorías creadas.")

            # 4. Crear 30 Productos (para probar paginación de 10 en 10)
            productos = []
            for i in range(1, 31):
                prod = Producto(
                    nombre=f"Producto Premium {i}",
                    descripcion=f"Descripción de alta calidad para el producto número {i} del catálogo.",
                    precio_base=float(random.randint(1500, 12000)),
                    imagenes_url=[],
                    stock_cantidad=random.randint(5, 150),
                    disponible=True
                )
                # Asignar relaciones aleatorias
                prod.categorias = random.sample(categorias, k=random.randint(1, 2))
                prod.ingredientes = random.sample(ingredientes, k=random.randint(2, 6))
                productos.append(prod)
            
            session.add_all(productos)
            session.commit()
            print(f"[SEED] {len(productos)} productos creados con sus respectivas relaciones.")
            
            print("[SEED] ¡Carga masiva completada con éxito!\n")

        except Exception as e:
            session.rollback()
            print(f"[SEED] ERROR CRÍTICO durante la carga masiva: {str(e)}")
