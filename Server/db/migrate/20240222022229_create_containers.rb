class CreateContainers < ActiveRecord::Migration[7.1]
  def change
    create_table :containers do |t|
      t.string :name
      t.text :description
      t.text :notes
      t.references :parent, null: true, foreign_key: { to_table: :containers, on_delete: :nullify }

      t.timestamps
    end
  end
end
