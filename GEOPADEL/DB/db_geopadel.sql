-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2018 a las 19:30:00
-- Versión del servidor: 10.1.26-MariaDB
-- Versión de PHP: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_geopadel`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horari_pistes`
--

CREATE TABLE `horari_pistes` (
  `horari_pistes_id` int(5) NOT NULL,
  `horari_pistes_dies` int(7) NOT NULL,
  `horari_pistes_hores` int(5) NOT NULL,
  `horari_pistes_pistes_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `horari_pistes`
--

INSERT INTO `horari_pistes` (`horari_pistes_id`, `horari_pistes_dies`, `horari_pistes_hores`, `horari_pistes_pistes_id`) VALUES
(0, 1111111, 11, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels`
--

CREATE TABLE `levels` (
  `levels_id` int(5) NOT NULL,
  `levels_desc` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `levels`
--

INSERT INTO `levels` (`levels_id`, `levels_desc`) VALUES
(0, 'Null'),
(1, 'Avançat'),
(2, 'Normal'),
(3, 'Principiant');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partides`
--

CREATE TABLE `partides` (
  `partides_id` int(5) NOT NULL,
  `partides_desc` varchar(50) NOT NULL,
  `partides_num_jugadors` int(5) NOT NULL,
  `pistes_id` int(5) NOT NULL,
  `partides_levels_id` int(5) NOT NULL,
  `partides_data` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `partides`
--

INSERT INTO `partides` (`partides_id`, `partides_desc`, `partides_num_jugadors`, `pistes_id`, `partides_levels_id`, `partides_data`) VALUES
(0, 'PartidaenALmoines', 4, 0, 0, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partides_users`
--

CREATE TABLE `partides_users` (
  `partides_users_id` int(5) NOT NULL,
  `partides_users_users_id` int(5) NOT NULL,
  `partides_users_partides_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pistes`
--

CREATE TABLE `pistes` (
  `pistes_id` int(5) NOT NULL,
  `pistes_desc` varchar(50) NOT NULL,
  `pistes_user_alias` varchar(50) NOT NULL,
  `pistes_situacio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `users_id` int(11) NOT NULL,
  `users_first_name` varchar(50) NOT NULL,
  `users_last_name` varchar(50) NOT NULL,
  `users_username` varchar(50) NOT NULL,
  `users_levels_id` int(5) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`users_id`, `users_first_name`, `users_last_name`, `users_username`, `users_levels_id`) VALUES
(136218125, 'Esteve', 'Mestre', 'emestre', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`levels_id`);

--
-- Indices de la tabla `partides`
--
ALTER TABLE `partides`
  ADD PRIMARY KEY (`partides_id`);

--
-- Indices de la tabla `partides_users`
--
ALTER TABLE `partides_users`
  ADD KEY `fk_partides_users_users` (`partides_users_users_id`),
  ADD KEY `fk_partides_users_partides` (`partides_users_partides_id`);

--
-- Indices de la tabla `pistes`
--
ALTER TABLE `pistes`
  ADD KEY `fk_pistes` (`pistes_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`users_id`),
  ADD KEY `fk_users_levels_id` (`users_levels_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `partides_users`
--
ALTER TABLE `partides_users`
  ADD CONSTRAINT `fk_partides_users_partides` FOREIGN KEY (`partides_users_partides_id`) REFERENCES `partides` (`partides_id`),
  ADD CONSTRAINT `fk_partides_users_users` FOREIGN KEY (`partides_users_users_id`) REFERENCES `users` (`users_id`);

--
-- Filtros para la tabla `pistes`
--
ALTER TABLE `pistes`
  ADD CONSTRAINT `fk_pistes` FOREIGN KEY (`pistes_id`) REFERENCES `partides` (`partides_id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_levels_id` FOREIGN KEY (`users_levels_id`) REFERENCES `levels` (`levels_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
