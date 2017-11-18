CREATE TABLE company (
    PRIMARY KEY (company_id),
    company_id          INT NOT NULL,
    company_name        TEXT NOT NULL,
    ceo_name            TEXT,
    company_description TEXT,
    hq_address          TEXT,
    num_employees       INT,
    sector              VARCHAR(30),
    industry            VARCHAR(30)
);

CREATE TABLE security (
    PRIMARY KEY (figi_id),
    figi_id             CHAR(12) NOT NULL,
    security_name       VARCHAR(30) NOT NULL,
    ticker              VARCHAR(10) NOT NULL,
    security_type       VARCHAR(10) NOT NULL,
    exchange            VARCHAR(20) NOT NULL,
    company_id          INT,
                        FOREIGN KEY (company_id) REFERENCES company(company_id)
                        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE price (
    PRIMARY KEY (figi_id, end_of_date),
    figi_id         CHAR(12) NOT NULL,
    end_of_date     DATE NOT NULL,
    price           NUMERIC(12, 2) NOT NULL,
                    FOREIGN KEY (figi_id) REFERENCES security(figi_id)
                    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE client (
    PRIMARY KEY (client_id),
    client_id           INT NOT NULL,
    birthdate           DATE NOT NULL,
    client_name         TEXT NOT NULL,
    remaining_funds     NUMERIC(12, 2) NOT NULL,
    country             TEXT
);


CREATE TABLE portfolio (
    PRIMARY KEY (portfolio_id),
    portfolio_id    INT NOT NULL,
    client_id       INT NOT NULL,
    target_date     DATE,
    strategy        VARCHAR(20) NOT NULL,
                    FOREIGN KEY (client_id) REFERENCES client(client_id)
                    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE portfolio_security (
    PRIMARY KEY (portfolio_id, figi_id),
    portfolio_id    INT NOT NULL,
    figi_id         CHAR(12) NOT NULL,
    purchase_date   DATE NOT NULL,
    purchase_price  NUMERIC(12, 2) NOT NULL,
    quantity        INT NOT NULL,
                    FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (figi_id) REFERENCES security(figi_id)
                    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE recommendation (
    PRIMARY KEY (recommendation_id),
    recommendation_id       INT NOT NULL,
    figi_id                 CHAR(12) NOT NULL,
    portfolio_id            INT NOT NULL,
    quantity                INT NOT NULL,
    transaction_type        VARCHAR(10) NOT NULL,
    submission_timestamp    TIMESTAMP NOT NULL,
                            FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id)
                            ON DELETE CASCADE ON UPDATE CASCADE,
                            FOREIGN KEY (figi_id) REFERENCES security(figi_id)
                            ON DELETE CASCADE ON UPDATE CASCADE
);

