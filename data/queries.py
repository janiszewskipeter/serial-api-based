from data import data_manager


def get_shows(offset, order, direction):
    return data_manager.execute_select("SELECT shows.id, title, EXTRACT (YEAR FROM year) AS year, runtime,\
                                        STRING_AGG(genres.name,', ') genres_list, CAST(ROUND(rating, 1) AS varchar) AS rating, trailer, homepage FROM shows\
                                        JOIN show_genres ON shows.id = show_genres.show_id\
                                       JOIN genres ON show_genres.genre_id = genres.id\
                                        GROUP BY shows.id, title, rating\
                                       ORDER BY " + str(order) + ' ' + str(direction) + " LIMIT 15 OFFSET " + str(
        offset))


def get_show(given_id):
    return data_manager.execute_select("SELECT shows.id, shows.title, TO_CHAR(year, 'Month DD, YYYY') date, runtime, shows.overview, \
                                        STRING_AGG(DISTINCT genres.name,', ') genres_list, STRING_AGG(a.name,', ') actors_list, \
                                        array_to_string((array_agg(DISTINCT a.name))[1:3], ', ') actors_list2,\
                                        CAST(ROUND(rating, 1) AS varchar) AS rating, trailer, homepage FROM shows\
                                        JOIN show_genres ON shows.id = show_genres.show_id\
                                       JOIN genres ON show_genres.genre_id = genres.id\
                                       JOIN show_characters sc on shows.id = sc.show_id\
                                       JOIN actors a on sc.actor_id = a.id\
                                       WHERE shows.id = " + given_id + "\
                                        GROUP BY shows.id, shows.title", fetchall=False)


def get_seasons(given_id):
    return data_manager.execute_select("SELECT season_number, title, overview FROM seasons\
                                       WHERE  show_id = " + given_id + "\
                                       ORDER BY season_number")


