class Containment < ApplicationRecord
  belongs_to :item
  belongs_to :container

  has_many :checkouts, query_constraints: [:containment_container_id, :containment_item_id]

  validates_uniqueness_of :item, scope: %i[container_id]
  validates :quantity, presence: true
  validates :position, presence: true
end
