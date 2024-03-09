-- 1. Models Table
CREATE TABLE models (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version_id UUID,
    integration_id UUID,
    api_key TEXT,
    initial_prompt JSONB,
    owner_id UUID NOT NULL
);

-- 2. Datasets Table
CREATE TABLE datasets (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    integration_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID NOT NULL
);

-- 3. Data Points Table
CREATE TABLE data_points (
    id UUID PRIMARY KEY,
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    owner_id UUID NOT NULL
);

-- Evaluations Table (Updated as per new requirements)
CREATE TABLE evaluations (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Points Table (New table as per requirements)
CREATE TABLE evaluation_points (
    id UUID PRIMARY KEY,
    data_point_id UUID REFERENCES data_points(id) ON DELETE SET NULL,
    score INT,
    comment TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    data JSONB,
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE
);

-- Evaluation_Models Junction Table (For many-to-many relationship between evaluations and models)
CREATE TABLE evaluation_models (
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    model_id UUID REFERENCES models(id) ON DELETE CASCADE,
    PRIMARY KEY (evaluation_id, model_id)
);

-- Tags Table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation tags link table (to support multiple tags for one evaluation)
CREATE TABLE evaluation_tags (
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (evaluation_id, tag_id)
);

-- 6. Logs Table
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    api TEXT,
    chat JSONB,
    prompt_tokens INT,
    completion_token INT,
    ip_address TEXT,
    type TEXT,
    provider TEXT,
    owner_id UUID NOT NULL
);

-- Log tags link table (to support multiple tags for one log)
CREATE TABLE log_tags (
    log_id INT REFERENCES logs(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (log_id, tag_id)
);

-- 7. Trainings Table
CREATE TABLE trainings (
    id UUID PRIMARY KEY,
    base_model_id UUID REFERENCES models(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
    result_model_id UUID REFERENCES models(id) ON DELETE SET NULL,
    status TEXT,
    training_started_at TIMESTAMPTZ,
    training_completed_at TIMESTAMPTZ,
    data JSONB,
    integration_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID NOT NULL
);
