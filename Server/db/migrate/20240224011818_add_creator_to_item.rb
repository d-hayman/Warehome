class AddCreatorToItem < ActiveRecord::Migration[7.1]
  def change
    add_reference :items, :creator, null: true, foreign_key: { to_table: :users, on_delete: :nullify }
  end
end
