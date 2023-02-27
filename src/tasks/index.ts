import toncenter_test from './toncenter_test'
import processTransactions from './processTransactions'
import processMessages from './processMessages'
import ton_wallet_action from './ton_wallet_action'
import compress_images from './compress_images'
import awards_action from './awards_action'
import update_logs from './update_logs'
import update_stats from './update_stats'
import users_action from './users_action'
import fill_created_at from './fill_created_at'

export const test = async (): Promise<void> => {
  console.log('test_task work')
}

export default {
  test,
  toncenter_test,
  process_transactions: processTransactions,
  process_messages: processMessages,
  ton_wallet_action,
  compress_images,
  awards_action,
  update_logs,
  update_stats,
  users_action,
  fill_created_at
}
