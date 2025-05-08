CREATE TABLE Campus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE Configuration (
    id SERIAL PRIMARY KEY,
    semester VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    information VARCHAR(255) NOT NULL,   
    campus_id INT NOT NULL,
    FOREIGN KEY (campus_id) REFERENCES Campus(id)
)

CREATE TABLE Program (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    campus_id INT NOT NULL,
    FOREIGN KEY (campus_id) REFERENCES Campus(id)
);

CREATE TABLE Coordinator (
    id SERIAL PRIMARY KEY,
    document VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    signature TEXT,
    program_id INT UNIQUE NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Program(id)
);

CREATE TABLE Teacher (
    id SERIAL PRIMARY KEY,
    document VARCHAR(50) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    phone VARCHAR(20),
    address TEXT,
    photo TEXT,
    signature TEXT,
    card VARCHAR(20),
    faculty VARCHAR(255),
    campus VARCHAR(255),
    employment_type VARCHAR(100),
    rank VARCHAR(100),
    undergraduate VARCHAR(255),
    specialization VARCHAR(255),
    master VARCHAR(255),
    doctorate VARCHAR(255),
    is_active BOOLEAN NOT NULL,
    program_id INT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES Program(id)
);

CREATE TABLE Activity (
    id SERIAL PRIMARY KEY,
    semester VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mission varchar(255) NOT NULL,
    convention varchar(255) NOT NULL,  
    description varchar(255) NOT NULL,
    group_name varchar(255) NOT NULL,
    hours NUMERIC(5,2) NOT NULL,
    responsible varchar(255) NOT NULL,
    product jsonb,
    teacher_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(id)
);

CREATE TABLE Schedule (
    id SERIAL PRIMARY KEY,
    semester VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    classification VARCHAR(255) NOT NULL,
    day VARCHAR(20) NOT NULL,
    moment VARCHAR(20) NOT NULL,
    observation TEXT,
    teacher_id INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(id)
    FOREIGN KEY (activity_id) REFERENCES Activity(id)
);

CREATE TABLE Format (
    id SERIAL PRIMARY KEY,
    semester VARCHAR(50) NOT NULL,
    isFinish BOOLEAN DEFAULT FALSE,
    isSigned BOOLEAN DEFAULT FALSE,
    teacher_id INT NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES Teacher(id)
);