# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
[
    ["Item", "index"],
    ["Item", "show"],
    ["Item", "create"],
    ["Item", "update"],
    ["Item", "destroy"],
    ["Item", "fetch_containers"],
    ["Item", "fetch_container"],
    ["Item", "add_subcategory"], #PUT /api/v1/items/:item_id/subcategories/:id See: https://stackoverflow.com/questions/33364584/rails-routing-for-has-and-belongs-to-many-relationship
    ["Item", "remove_subcategory"], #DELETE /api/v1/items/:item_id/subcategories/:id See: 
    ["Container", "index"],
    ["Container", "show"],
    ["Container", "create"],
    ["Container", "update"],
    ["Container", "destroy"],
    ["Container", "fetch_items"],
    ["Container", "fetch_item"],
    ["Container", "add_item"], #POST /api/v1/container/:id/item/:item_id - created Containment
    ["Container", "update_item"], #PUT /api/v1/container/:id/item/:item_id - created Containment
    ["Container", "remove_item"], #DELETE /api/v1/container/:id/item/:item_id
    ["Checkout", "create"], #POST /api/v1/container/:id/item/:item_id/checkout
    ["Checkout", "destroy"], #DELETE /api/v1/container/:id/item/:item_id/checkout - allowSelf applies
    ["Category", "index"],
    ["Category", "show"],
    ["Category", "create"],
    ["Category", "update"],
    ["Category", "destroy"],
    ["Subcategory", "index"],
    ["Subcategory", "show"],
    ["Subcategory", "create"],
    ["Subcategory", "update"],
    ["Subcategory", "destroy"],
    ["AdminPanel", "view"],
    ["User", "index"],
    ["User", "show"],
    ["User", "create"],
    ["User", "update"],
    ["User", "destroy"],
    ["Role", "index"],
    ["Role", "show"],
    ["Role", "create"],
    ["Role", "update"],
    ["Role", "destroy"],
    ["Permission", "index"],
    ["Permission", "show"],
    ["Setting", "index"],
    ["Setting", "update"]
].each do |model, action|
    Permission.find_or_create_by(model: model, action: action)
end

adminRole = Role.find_or_create_by(name: "Admin")

adminRole.permissions = Permission.all

adminRole.save
