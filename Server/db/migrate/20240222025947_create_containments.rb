class CreateContainments < ActiveRecord::Migration[7.1]
  def change
    create_table :containments, primary_key: [:container_id, :item_id] do |t|
      t.references :item, null: false, foreign_key: { on_delete: :cascade }
      t.references :container, null: false, foreign_key: { on_delete: :cascade }
      t.integer :quantity
      t.string :position

      t.timestamps
    end
  end
end
