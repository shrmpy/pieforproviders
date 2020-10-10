class RemoveCcmsIdAndAssociateChildrenToBusinesses < ActiveRecord::Migration[6.0]
  def change
    remove_index :children, column: %i[full_name date_of_birth user_id], unique: true
    remove_column :children, :ccms_id, :string
    add_reference :children, :business, type: :uuid, foreign_key: true
    add_index :children, %i[full_name date_of_birth business_id], unique: true, name: :unique_children
    change_column_null :children, :user_id, true
  end
end
