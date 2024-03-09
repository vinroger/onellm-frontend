export type Dataset = {
  id: string;
  name: string;
  description: string;
  integration_id: string; // for integration with open ai, gemini, etc
  created_at: Date;
  updated_at: Date;
};

export type DataPoint = {
  id: string;
  dataset_id: string;
  created_at: Date;
  updated_at: Date;
  title: string;

  data: any; // JSON binary
};

/* 

CREATE TABLE datasets (
    dataset_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE data_points (
    data_point_id SERIAL PRIMARY KEY,
    dataset_id INT NOT NULL,
    title TEXT NOT NULL,
    json_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(dataset_id) ON DELETE CASCADE
);

*/
