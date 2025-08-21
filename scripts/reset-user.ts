import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'hsa.db');

function resetUserData(email: string) {
  return new Promise<void>((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    db.serialize(() => {
      console.log(`🔄 Resetting data for user: ${email}`);
      
      // Delete deposits
      db.run(
        `DELETE FROM deposits WHERE account_id = (
          SELECT ha.id FROM hsa_accounts ha 
          JOIN users u ON ha.user_id = u.id 
          WHERE u.email = ?
        )`,
        [email],
        function(err) {
          if (err) {
            console.error('❌ Error deleting deposits:', err.message);
            reject(err);
            return;
          }
          console.log(`✅ Deleted ${this.changes} deposit(s)`);
        }
      );

      // Delete transactions
      db.run(
        `DELETE FROM transactions WHERE account_id = (
          SELECT ha.id FROM hsa_accounts ha 
          JOIN users u ON ha.user_id = u.id 
          WHERE u.email = ?
        )`,
        [email],
        function(err) {
          if (err) {
            console.error('❌ Error deleting transactions:', err.message);
            reject(err);
            return;
          }
          console.log(`✅ Deleted ${this.changes} transaction(s)`);
        }
      );

      // Reset account balance to 0
      db.run(
        `UPDATE hsa_accounts SET balance = 0.00 
         WHERE user_id = (SELECT id FROM users WHERE email = ?)`,
        [email],
        function(err) {
          if (err) {
            console.error('❌ Error resetting balance:', err.message);
            reject(err);
            return;
          }
          console.log(`✅ Reset balance to $0.00`);
        }
      );

      // Verify the reset
      db.get(
        `SELECT ha.balance, 
                (SELECT COUNT(*) FROM transactions t WHERE t.account_id = ha.id) as transaction_count, 
                (SELECT COUNT(*) FROM deposits d WHERE d.account_id = ha.id) as deposit_count 
         FROM hsa_accounts ha 
         JOIN users u ON ha.user_id = u.id 
         WHERE u.email = ?`,
        [email],
        (err, row) => {
          if (err) {
            console.error('❌ Error verifying reset:', err.message);
            reject(err);
            return;
          }
          
          if (row) {
            console.log('\n📊 Reset Summary:');
            console.log(`   Balance: $${row.balance.toFixed(2)}`);
            console.log(`   Transactions: ${row.transaction_count}`);
            console.log(`   Deposits: ${row.deposit_count}`);
            console.log('\n✅ User data reset completed successfully!');
          } else {
            console.log('⚠️  User not found or no account associated');
          }
          
          db.close((closeErr) => {
            if (closeErr) {
              console.error('❌ Error closing database:', closeErr.message);
              reject(closeErr);
            } else {
              resolve();
            }
          });
        }
      );
    });
  });
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npm run reset-user <email>');
  console.log('Example: npm run reset-user test@hsa.com');
  process.exit(1);
}

resetUserData(email)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }); 