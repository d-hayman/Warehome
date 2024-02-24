class AddCreatorToSubcategory < ActiveRecord::Migration[7.1]
  def change
    add_reference :subcategories, :creator, null: true, foreign_key: { to_table: :users, on_delete: :nullify }
  end
end
