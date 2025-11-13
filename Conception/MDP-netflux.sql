-- ----------------------------------------------------------
-- Script MYSQL pour mcd 
-- ----------------------------------------------------------


-- ----------------------------
-- Table: Contenu
-- ----------------------------
CREATE TABLE Contenu (
  id_contenu INT NOT NULL,
  titre VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  annee_sortie DATE NOT NULL,
  affiche VARCHAR(100),
  video VARCHAR(100),
  CONSTRAINT Contenu_PK PRIMARY KEY (id_contenu)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Genre
-- ----------------------------
CREATE TABLE Genre (
  id_genre INT NOT NULL,
  nom_genre VARCHAR(100) NOT NULL,
  CONSTRAINT Genre_PK PRIMARY KEY (id_genre)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: Utilisateur
-- ----------------------------
CREATE TABLE Utilisateur (
  id_utilisateur INT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  mot_de_passe VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  role VARCHAR(100) NOT NULL,
  CONSTRAINT Utilisateur_PK PRIMARY KEY (id_utilisateur),
  CONSTRAINT email UNIQUE (email)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: appartient
-- ----------------------------
CREATE TABLE appartient (
  id_contenu INT NOT NULL,
  id_genre INT NOT NULL,
  CONSTRAINT appartient_PK PRIMARY KEY (id_contenu, id_genre),
  CONSTRAINT appartient_id_contenu_FK FOREIGN KEY (id_contenu) REFERENCES Contenu (id_contenu),
  CONSTRAINT appartient_id_genre_FK FOREIGN KEY (id_genre) REFERENCES Genre (id_genre)
)ENGINE=InnoDB;


-- ----------------------------
-- Table: favori
-- ----------------------------
CREATE TABLE favori (
  id_contenu INT NOT NULL,
  id_utilisateur INT NOT NULL,
  CONSTRAINT favori_PK PRIMARY KEY (id_contenu, id_utilisateur),
  CONSTRAINT favori_id_contenu_FK FOREIGN KEY (id_contenu) REFERENCES Contenu (id_contenu),
  CONSTRAINT favori_id_utilisateur_FK FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur (id_utilisateur)
)ENGINE=InnoDB;