class CreatePermissions < ActiveRecord::Migration[7.1]
  def change
    create_table :permissions do |t|
      t.string :model
      t.string :action

      t.timestamps
    end
    add_index :permissions, :model
    add_index :permissions, :action
  end
end
