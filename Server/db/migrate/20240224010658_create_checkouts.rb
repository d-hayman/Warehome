class CreateCheckouts < ActiveRecord::Migration[7.1]
  def change
    create_table :checkouts do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }

      t.bigint :containment_container_id, null: false
      t.bigint :containment_item_id, null: false
      t.foreign_key :containments, column: %i[containment_container_id containment_item_id], primary_key: %i[container_id item_id], on_delete: :cascade

      t.integer :quantity

      t.timestamps
    end
  end
end
