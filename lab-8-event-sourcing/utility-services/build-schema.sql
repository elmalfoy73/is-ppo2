CREATE TYPE event_status AS ENUM ('INITIATED', 'PROCESSING', 'SUCCEEDED', 'FAILED');
CREATE TYPE kafka_topic AS ENUM ('default', 'user.account');
CREATE TYPE kafka_event AS ENUM ('create', 'create.fail', 'create.success');
CREATE TYPE tranaction_purpose AS ENUM ('deposit', 'withdraw', 'transfer');

ALTER TYPE kafka_topic ADD VALUE 'bank.account';
ALTER TYPE kafka_event ADD VALUE  'update';
ALTER TYPE kafka_event ADD VALUE  'update.success';
ALTER TYPE kafka_event ADD VALUE  'update.fail';
ALTER TYPE kafka_topic ADD VALUE 'saga.bank.account';
ALTER TYPE kafka_topic ADD VALUE 'transaction';




CREATE TABLE IF NOT EXISTS accounts(
                                       id UUID PRIMARY KEY,
                                       first_name varchar(255) not null,
    last_name varchar(255) not null,
    email varchar(255) unique not null,
    created_at timestamp not null,
    updated_at timestamp not null
    );

CREATE TABLE IF NOT EXISTS kafka_events(
                                           id UUID PRIMARY KEY,
                                           requester_id uuid references kafka_events(id),
    event_topic kafka_topic not null,
    event kafka_event not null,
    event_status event_status not null,
    event_payload jsonb,
    created_at timestamp not null,
    updated_at timestamp not null
    );

CREATE TABLE IF NOT EXISTS currencies(
                                         id UUID PRIMARY KEY,
                                         currency varchar(16) unique,
    name varchar(255),
    is_active boolean not null default true,
    created_at timestamp not null,
    updated_at timestamp not null
    );

CREATE TABLE IF NOT EXISTS bank_accounts(
                                            id UUID PRIMARY KEY,
                                            owner_account_id uuid not null references accounts(id),
    amount double precision not null default 0.0,
    reserved_amount double precision not null default 0.0,
    currency_id uuid not null references currencies(id),
    is_active boolean default true,
    created_at timestamp not null,
    updated_at timestamp not null
    );

CREATE TABLE IF NOT EXISTS saga_fallback(
                                            request_id uuid primary key references kafka_events(id),
    executed_steps_payload jsonb not null,
    initial_entity_state jsonb,
    created_at timestamp not null ,
    updated_at timestamp not null
    );

CREATE TABLE IF NOT EXISTS transactions(
                                           id uuid primary key,
                                           source_id uuid references bank_accounts(id),
    destination_id uuid references bank_accounts(id),
    amount double precision not null ,
    purpose tranaction_purpose not null ,
    created_at timestamp not null ,
    updated_at timestamp not null
    )