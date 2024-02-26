class Checkout < ApplicationRecord
  belongs_to :containment, query_constraints: [:containment_container_id, :containment_item_id]
  has_one :item, through: :containment
  has_one :container, through: :containment
  
  belongs_to :user


  validate :valid_subset

  def valid_subset
    if quantity.nil? || quantity < 1
      errors.add(:quantity, "Must be a positive quantity")
      return
    end
    available = containment.quantity - containment.checkouts.sum(:quantity)
    if quantity > available
      errors.add(:quantity, "Not enough remain: " + available.to_s)
    end
  end
end
