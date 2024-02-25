class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :rememberable, :validatable, :jwt_authenticatable, jwt_revocation_strategy: self

  has_and_belongs_to_many :roles
  has_many :permissions, through: :roles

  has_many :checkouts

  validates :username, uniqueness: true, length: { minimum: 4 }

  validates :password_confirmation, presence: true, on: :create

  #for good measure because I can't stress how much email is not a thing for an internal service running on an intranet
  def email_required?
    false
   end
  
   def will_save_change_to_email?
    false
   end
  
   def email_changed?
    false
   end
end
