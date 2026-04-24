# backend/services/data_service.py

from services.firestore_client import db

class DataService:
    def extract_content_from_file(self, file, file_type):
        # SIMULATION: This logic represents your AI Agent extracting data
        if file_type == 'voice':
            return [{"item": "Restock Chicken", "price": 12.50, "conf": 88}]
        elif file_type == 'pdf':
            return [
                {"item": "Bulk Rice (50kg)", "price": 180.00, "conf": 98},
                {"item": "Cooking Oil", "price": 45.00, "conf": 95}
            ]
        else: # Receipt/Image
            return [{"item": "Garlic", "price": 7.00, "conf": 92}]

    def get_workspace_stats(self):
        try:
            # Dynamically count documents in your real collections
            inventory_ref = db.collection('inventorySnapshots').stream()
            sales_ref = db.collection('orders').stream()
            products_ref = db.collection('products').stream()
            
            # Convert streams to counts
            inventory_count = sum(1 for _ in inventory_ref)
            sales_count = sum(1 for _ in sales_ref)
            supplier_count = sum(1 for _ in products_ref)
            
            return [
                {"title": "Inventory Data", "records": inventory_count, "confidence": "94%", "color": "text-[#10B981]"},
                {"title": "Sales Data", "records": sales_count, "confidence": "92%", "color": "text-[#10B981]"},
                {"title": "Supplier Data", "records": supplier_count, "confidence": "90%", "color": "text-[#10B981]"},
                {"title": "Performance Data", "records": 12, "confidence": "91%", "color": "text-[#10B981]"}
            ]
        except Exception as e:
            print(f"Stats Error: {e}")
            return []

    def get_table_data(self):
        try:
            # Fetch products from your dataset
            products_ref = db.collection('products').stream()
            table_rows = []
            for doc in products_ref:
                p = doc.to_dict()
                table_rows.append({
                    "id": doc.id,
                    "item": p.get('name', 'Unknown Item'),
                    "cat": p.get('category_id', 'General').replace('cat_', '').title(),
                    "qty": "Check Inventory",
                    "price": float(p.get('cogs_per_unit', 0)),
                    "source": "Master DB",
                    "conf": 95 if p.get('cogs_per_unit') else 40
                })
            return table_rows
        except Exception as e:
            print(f"Table Error: {e}")
            return []

    def update_record(self, doc_id, updated_fields):
        # Directly update the Firestore document
        db.collection('products').document(doc_id).update(updated_fields)
        return True