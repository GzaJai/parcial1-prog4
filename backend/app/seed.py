import random
from sqlmodel import Session, text
from database import engine
from models import Categoria, Ingrediente, Producto

def seed_data():
    print("\n[SEED] Reiniciando menú (Todos los productos con ingredientes)...")
    with Session(engine) as session:
        try:
            # 1. Limpieza total
            session.execute(text("TRUNCATE categoria, ingrediente, producto RESTART IDENTITY CASCADE;"))
            session.commit()

            # 2. Diccionario de Ingredientes Expandido
            ing_map = {
                # Lácteos / Alérgenos
                "Muzarella": True, "Cheddar": True, "Parmesano": True, "Roquefort": True, 
                "Leche Entera": True, "Crema de Leche": True, "Huevo": True,
                # Carnes
                "Jamón Cocido": False, "Bacon": False, "Pepperoni": False, "Pollo": False, "Carne Vacuna": False,
                # Vegetales y Salsas
                "Tomate": False, "Lechuga": False, "Cebolla Morada": False, "Pimientos": False, "Aceitunas": False,
                "Ajo": False, "Rúcula": False, "Guacamole": False, "Champiñones": False, "Salsa BBQ": False, "Alioli": False,
                # Panificados
                "Pan Brioche": True, "Pan con Sésamo": True,
                # Ingredientes Base para Bebidas y Postres
                "Agua Mineral": False, "Azúcar": False, "Granos de Café": False, "Extracto de Vainilla": False,
                "Cebada": True, "Uvas Malbec": False, "Chocolate Amargo": False, "Dulce de Leche": True
            }
            
            db_ingredientes = {}
            for nombre, alergeno in ing_map.items():
                ing = Ingrediente(nombre=nombre, descripcion=f"Ingrediente de calidad: {nombre}", es_alergeno=alergeno)
                session.add(ing)
                db_ingredientes[nombre] = ing
            session.commit()

            # 3. Categorías
            cat_nombres = ["Pizzas", "Hamburguesas", "Bebidas", "Postres", "Entradas"]
            db_categorias = {}
            for nombre in cat_nombres:
                cat = Categoria(nombre=nombre, descripcion=f"Nuestras mejores {nombre} artesanales")
                session.add(cat)
                db_categorias[nombre] = cat
            session.commit()

            # 4. Definición de Menú Completo (Cada uno con al menos un ingrediente)
            menu = {
                "Pizzas": [
                    ("Muzzarella Clásica", "Salsa de tomate, muzzarella y orégano", 7500, ["Muzarella", "Tomate", "Aceitunas"]),
                    ("Napolitana Especial", "Tomate natural, ajo, muzzarella y albahaca", 8200, ["Muzarella", "Tomate", "Ajo"]),
                    ("Fugazzeta con Queso", "Cebolla caramelizada y muzzarella de calidad", 8500, ["Muzarella", "Cebolla Morada"]),
                    ("Calabresa Picante", "Muzzarella, rodajas de salame y pimentón", 8800, ["Muzarella", "Pepperoni"]),
                    ("Rúcula y Jamón Crudo", "Muzzarella, rúcula fresca y finas fetas de jamón", 9500, ["Muzarella", "Rúcula", "Jamón Cocido"])
                ],
                "Hamburguesas": [
                    ("Doble Cheese", "Doble medallón de carne, doble cheddar y bacon crocante", 6500, ["Carne Vacuna", "Cheddar", "Pan Brioche"]),
                    ("La Bestia BBQ", "Carne, aros de cebolla, bacon y mucha salsa BBQ", 7200, ["Carne Vacuna", "Cebolla Morada", "Salsa BBQ", "Pan con Sésamo"]),
                    ("Blue Burger", "Queso azul, cebolla caramelizada y rúcula fresca", 6900, ["Carne Vacuna", "Roquefort", "Cebolla Morada", "Pan Brioche"]),
                    ("Classic Burger", "Lechuga, tomate, cebolla morada y alioli casero", 5800, ["Carne Vacuna", "Lechuga", "Tomate", "Alioli"]),
                    ("Crispy Chicken", "Pollo rebozado, lechuga repollada y mayonesa", 6200, ["Pollo", "Lechuga", "Pan con Sésamo"])
                ],
                "Bebidas": [
                    ("Coca Cola Original", "Gaseosa línea Coca-Cola 500ml", 1500, ["Agua Mineral", "Azúcar"]),
                    ("Sprite Lima-Limón", "Gaseosa línea Coca-Cola 500ml", 1500, ["Agua Mineral", "Azúcar"]),
                    ("Cerveza Artesanal IPA", "Pinta de 500ml de autor", 3500, ["Agua Mineral", "Cebada"]),
                    ("Vino Malbec Copa", "Copa de vino tinto selección especial", 4200, ["Uvas Malbec"]),
                    ("Agua Mineral Villavicencio", "Agua mineral 500ml", 1200, ["Agua Mineral"])
                ],
                "Entradas": [
                    ("Papas con Cheddar", "Papas fritas con salsa cheddar y lluvia de verdeo", 3500, ["Cheddar", "Bacon"]),
                    ("Bastones de Muzzarella", "Rebozados y fritos, con salsa pomodoro", 3800, ["Muzarella", "Tomate"]),
                    ("Nachos con Guacamole", "Nachos de maíz caseros y crema de palta", 4200, ["Guacamole", "Tomate"]),
                    ("Alitas de Pollo BBQ", "Alitas crocantes bañadas en salsa BBQ", 4500, ["Pollo", "Salsa BBQ"]),
                    ("Empanada Salteña", "Carne cortada a cuchillo (unidad)", 850, ["Carne Vacuna", "Cebolla Morada"])
                ],
                "Postres": [
                    ("Flan con Dulce", "Flan casero con abundante dulce de leche", 2500, ["Huevo", "Leche Entera", "Dulce de Leche"]),
                    ("Chocotorta", "El postre favorito de los argentinos", 3200, ["Dulce de Leche", "Chocolate Amargo"]),
                    ("Tiramisú", "Café italiano, mascarpone y cacao amargo", 3500, ["Granos de Café", "Huevo", "Chocolate Amargo"]),
                    ("Copa Helada", "Dos bochas de helado premium a elección", 2200, ["Leche Entera", "Azúcar"]),
                    ("Volcán de Chocolate", "Chocolate amargo fundido con helado de crema", 4500, ["Chocolate Amargo", "Huevo", "Leche Entera"])
                ]
            }

            total_productos = 0
            for cat_nombre, items in menu.items():
                cat_obj = db_categorias[cat_nombre]
                for nombre, desc, precio, ings_nombres in items:
                    prod = Producto(
                        nombre=nombre,
                        descripcion=desc,
                        precio_base=float(precio),
                        stock_cantidad=random.randint(10, 50),
                        disponible=True,
                        imagenes_url=[]
                    )
                    prod.categorias = [cat_obj]
                    # Asegurar que cada producto tenga al menos los ingredientes definidos
                    prod.ingredientes = [db_ingredientes[n] for n in ings_nombres if n in db_ingredientes]
                    session.add(prod)
                    total_productos += 1
            
            session.commit()
            print(f"[SEED] Éxito: Todo el menú ({total_productos} productos) tiene ingredientes asignados.\n")

        except Exception as e:
            session.rollback()
            print(f"[SEED] ERROR CRÍTICO: {str(e)}")
