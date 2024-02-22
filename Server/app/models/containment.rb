class Containment < ApplicationRecord
  belongs_to :item
  belongs_to :container

  validates :quantity, presence: true
  validates :position, presence: true
end
