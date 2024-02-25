class PermissionsRoles < ActiveRecord::Migration[7.1]
  def change
    create_table :permissions_roles, primary_key: [:permission_id, :role_id] do |t|
      t.belongs_to :permission
      t.belongs_to :role
    end

    add_foreign_key :permissions_roles, :permissions, on_delete: :cascade
    add_foreign_key :permissions_roles, :roles, on_delete: :cascade
  end
end
