import mysql.connector
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config["DEBUG"] = True

connector_config = {
    'host': "localhost",
    'user': "root",
    'password': "hema123",
    'database': "ScorecardV5",
    'autocommit': True
}


def get_system_events(db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute("SELECT eventID, eventName "
                     "FROM systemevents")
    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/system_events', methods=['GET'])
def system_events():
    mydb = mysql.connector.connect(**connector_config)
    return get_system_events(mydb)


def get_tournaments_in_event(eventID, db):
    select_tournamentIDs = f'SELECT tournamentID FROM eventtournaments WHERE eventID = {eventID}'

    mycursor = db.cursor(dictionary=True)

    mycursor.execute(select_tournamentIDs)
    myresult = mycursor.fetchall()
    mycursor.close()

    db.close()
    return jsonify(myresult)


@app.route('/api/system_events/tournaments', methods=['GET'])
def tournaments_in_event():
    eventID = request.args.get('eventID')
    mydb = mysql.connector.connect(**connector_config)
    return get_tournaments_in_event(eventID, mydb)


# for debugging: group retrieval - in order to get matches, you have to access groups (pools) first
def get_groups_in_tournament(tournamentID, db):

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT groupID, groupName "
                     f"FROM eventgroups "
                     f"WHERE tournamentID = {tournamentID}")

    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/system_events/tournaments/groups', methods=['GET'])
def groups_in_tournament():
    tournamentID = request.args.get('tournamentID')
    mydb = mysql.connector.connect(**connector_config)
    return get_groups_in_tournament(tournamentID, mydb)


def get_matches_in_group(groupID, db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT matchID "
                     f"FROM eventmatches "
                     f"WHERE groupID = {groupID}")

    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/system_events/tournaments/groups/matches', methods=['GET'])
def matches_in_group():
    groupID = request.args.get('groupID')
    mydb = mysql.connector.connect(**connector_config)
    return get_matches_in_group(groupID, mydb)


def get_pools(tournamentID, db):
    select_groupIDs = f'SELECT groupID ' \
                      f'FROM eventgroups ' \
                      f'WHERE tournamentID = {tournamentID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_groupIDs)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


def get_roster(tournamentID, db):
    select_rosterIDs = f'SELECT rosterID ' \
                       f'FROM eventtournamentroster ' \
                       f'WHERE tournamentID = {tournamentID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_rosterIDs)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


def get_system_roster(tournamentID, db):
    select_rosterIDs = f'(SELECT rosterID ' \
                       f'FROM eventtournamentroster ' \
                       f'WHERE tournamentID = {tournamentID})'
    select_system_rosterIDs = f'SELECT rosterID, systemRosterID FROM eventroster WHERE rosterID IN {select_rosterIDs}'


    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_system_rosterIDs)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


def get_matches(tournamentID, db):
    select_groupIDs = f'(SELECT groupID FROM eventgroups WHERE tournamentID = {tournamentID})'
    select_matchIDs = f'SELECT matchID, groupID, matchNumber, fighter1ID, fighter1Score, fighter2ID, fighter2Score ' \
                      f'FROM eventmatches ' \
                      f'WHERE groupID IN {select_groupIDs}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_matchIDs)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


def get_fighters(tournamentID, db):
    select_eventID = f'(SELECT eventID FROM eventtournaments WHERE tournamentID = {tournamentID})'
    select_system_rosterIDs = f'(SELECT systemrosterID FROM eventroster WHERE eventID = {select_eventID})'
    select_fighter_names = f'SELECT firstName, lastName, systemRosterID ' \
                           f'FROM systemroster ' \
                           f'WHERE systemRosterID IN {select_system_rosterIDs}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_fighter_names)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


@app.route('/api/system_events/tournaments/matches', methods=['GET'])
def matches_in_tournament():
    tournamentID = request.args.get('tournamentID')
    mydb = mysql.connector.connect(**connector_config)

    # get all possible information for a given tournamentID
    pools = get_pools(tournamentID, mydb)
    system_roster = get_system_roster(tournamentID, mydb)
    matches = get_matches(tournamentID, mydb)
    fighters = get_fighters(tournamentID, mydb)

    ret = dict()
    ret["pools"] = pools
    ret["system_roster"] = system_roster
    ret["matches"] = matches
    ret["fighters"] = fighters

    mydb.close()

    return jsonify(ret)


def get_specific_match(matchID, db):
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"
    select_match = f'SELECT {relevantFields} FROM eventmatches WHERE matchID = {matchID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_match)

    myresult = mycursor.fetchone()
    mycursor.close()
    return myresult


def get_tournamentID_for_match(matchID, db):
    select_groupID = f'(SELECT groupID FROM eventmatches WHERE matchID = {matchID})'
    select_tournamentID = f'SELECT tournamentID FROM eventgroups WHERE groupID IN {select_groupID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_tournamentID)
    myresult = mycursor.fetchone()
    mycursor.close()

    return myresult['tournamentID']


def get_group_match_is_in(matchID, db):
    select_groupID = f'SELECT groupID FROM eventmatches WHERE matchID = {matchID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_groupID)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult


def get_penalties_for_match(matchID, db):

    select_penalties = f"SELECT matchID, exchangeType, receivingID " \
                       f"FROM eventexchanges " \
                       f"WHERE matchID = {matchID} AND exchangeType = 'penalty'"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_penalties)
    myresult = mycursor.fetchall()
    mycursor.close()

    return myresult

@app.route('/api/match', methods=['GET'])
def specific_match():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)

    match = get_specific_match(matchID, mydb)
    penalties = get_penalties_for_match(matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    ret = dict()
    ret["match"] = match
    ret["penalties"] = penalties

    mydb.close()

    return jsonify(ret)


def increase_score(fighter_number, matchID, db):
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"


    mycursor = db.cursor(dictionary=True)

    # for debugging only; resets scores of 0 to null
    # mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = NULL WHERE {fighterNScore} = 0")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = 0 "
                     f"WHERE {fighterNScore} IS NULL")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = {fighterNScore} + 1 "
                     f"WHERE matchID = {matchID}")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    myresult = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return myresult


@app.route('/api/match/increase_score_fighter1', methods=['GET', 'POST'])
def matches_increase_score_fighter1():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    match = increase_score(1, matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    mydb.close()
    return jsonify(match)


@app.route('/api/match/increase_score_fighter2', methods=['GET', 'POST'])
def matches_increase_score_fighter2():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    match = increase_score(2, matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    mydb.close()
    return jsonify(match)


def decrease_score(fighter_number, matchID, db):
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = 0 "
                     f"WHERE {fighterNScore} IS NULL")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = {fighterNScore} - 1 "
                     f"WHERE matchID = {matchID} AND {fighterNScore} > 0")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    myresult = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return myresult


@app.route('/api/match/decrease_score_fighter1', methods=['GET', 'POST'])
def matches_decrease_score_fighter1():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    match = decrease_score(1, matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    mydb.close()
    return jsonify(match)


@app.route('/api/match/decrease_score_fighter2', methods=['GET', 'POST'])
def matches_decrease_score_fighter2():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    match = decrease_score(2, matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    mydb.close()
    return jsonify(match)


def give_penalty_to_fighter(fighter_number, matchID, db):
    fighterID_field_name = f'fighter{fighter_number}ID'
    fighterID = f'(SELECT {fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, receivingID) "
                     f"VALUES ({matchID}, 'penalty', {fighterID})")

    mycursor.execute(f"SELECT matchID, exchangeType, receivingID "
                     f"FROM eventexchanges "
                     f"WHERE matchID = {matchID} AND exchangeType = 'penalty' AND receivingID = {fighterID}")

    myresult = mycursor.fetchall()
    db.commit()

    mycursor.close()
    return myresult


@app.route('/api/match/penalty_fighter1', methods=['GET', 'POST'])
def matches_give_penalty_to_fighter1():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    penalties = give_penalty_to_fighter(1, matchID, mydb)
    match = get_specific_match(matchID, mydb)
    match['tournamentID'] = get_tournamentID_for_match(matchID, mydb)
    ret = dict()
    ret['match'] = match
    ret['penalties'] = penalties

    mydb.close()
    return jsonify(ret)


@app.route('/api/match/penalty_fighter2', methods=['GET', 'POST'])
def matches_give_penalty_to_fighter2():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)
    penalties = give_penalty_to_fighter(2, matchID, mydb)
    match = get_specific_match(matchID, mydb)
    match['tournamentID'] = get_tournamentID_for_match(matchID, mydb)
    ret = dict()
    ret['match'] = match
    ret['penalties'] = penalties

    mydb.close()
    return jsonify(ret)


def get_fighter_names(fighterID, db):
    mycursor = db.cursor(dictionary=True)
    systemRosterID = f"(SELECT systemRosterID FROM eventroster WHERE rosterID = {fighterID})"

    mycursor.execute(f"SELECT firstName, lastName "
                     f"FROM systemroster "
                     f"WHERE systemRosterID = {systemRosterID}")

    myresult = mycursor.fetchone()
    mycursor.close()
    db.close()

    return jsonify(myresult)


@app.route('/api/fighters', methods=['GET'])
def matches_get_fighters():
    fighterID = request.args.get('fighterID')
    mydb = mysql.connector.connect(**connector_config)
    return get_fighter_names(fighterID, mydb)


app.run(host='0.0.0.0')
