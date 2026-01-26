// Check database records script
require('dotenv').config();

const { Client } = require('pg');

async function checkRecords() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Check tenants
    const tenants = await client.query('SELECT id, name FROM tenants LIMIT 5');
    console.log("Tenants:", tenants.rows);

    // Check whatsapp_accounts
    const whatsappAccounts = await client.query('SELECT id, tenant_id, phone_number, phone_number_id, status FROM whatsapp_accounts LIMIT 5');
    console.log("WhatsApp Accounts:", whatsappAccounts.rows);

    // Check ai_assistants
    const aiAssistants = await client.query('SELECT id, tenant_id, name, is_default FROM ai_assistants LIMIT 5');
    console.log("AI Assistants:", aiAssistants.rows);

  } catch (error) {
    console.error("Error checking records:", error);
  } finally {
    await client.end();
  }
}

// Run the check
checkRecords();