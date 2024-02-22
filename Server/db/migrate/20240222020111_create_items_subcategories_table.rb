class CreateItemsSubcategoriesTable < ActiveRecord::Migration[7.1]
  def change
    create_table :items_subcategories, primary_key: [:item_id, :subcategory_id] do |t|
      t.belongs_to :item
      t.belongs_to :subcategory
    end

    add_foreign_key :items_subcategories, :items, on_delete: :cascade
    add_foreign_key :items_subcategories, :subcategories, on_delete: :cascade
  end
end