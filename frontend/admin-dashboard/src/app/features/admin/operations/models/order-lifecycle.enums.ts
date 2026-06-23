/** Timeline phase for operational views (−72h lock through delivery). */
export enum OrderLifecyclePhase {
  Editable = 'editable',
  LockedAt72h = 'locked_at_72h',
  AwaitingRestaurantConfirmation = 'awaiting_restaurant_confirmation',
  ConfirmationOverdue = 'confirmation_overdue',
  ReplacementWindowOpen = 'replacement_window_open',
  PreparingAt24h = 'preparing_at_24h',
  Delivered = 'delivered',
}

export enum RestaurantConfirmationStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Overdue = 'overdue',
  Reassigned = 'reassigned',
}

export enum OrderExceptionType {
  ChangeBox = 'change_box',
  ChangeRestaurant = 'change_restaurant',
  CancelDay = 'cancel_day',
}

export enum ReplacementWindowStatus {
  NotOpened = 'not_opened',
  Open = 'open',
  Expired = 'expired',
  Completed = 'completed',
}

export type OrderWorkspaceView =
  | 'needs-action'
  | 'all'
  | 'confirmation'
  | 'replacement'
  | 'prep';
