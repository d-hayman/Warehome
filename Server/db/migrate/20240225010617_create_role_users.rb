class CreateRoleUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :roles_users, primary_key: [:role_id, :user_id] do |t|
      t.belongs_to :role
      t.belongs_to :user
    end

    add_foreign_key :roles_users, :roles, on_delete: :cascade
    add_foreign_key :roles_users, :users, on_delete: :cascade
  end
end
