class AddCreatorToCategory < ActiveRecord::Migration[7.1]
  def change
    add_reference :categories, :creator, null: true, foreign_key: { to_table: :users, on_delete: :nullify }
  end
end
