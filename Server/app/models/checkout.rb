class Checkout < ApplicationRecord
  belongs_to :containment, query_constraints: [:containment_container_id, :containment_item_id]
  belongs_to :user

  has_one :item, through: :containment
  has_one :container, through: :containment
end
