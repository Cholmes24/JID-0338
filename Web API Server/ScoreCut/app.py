import sys
import secrets
import mysql.connector
import webbrowser
from flask import Flask, request, jsonify
from config import ConnectorConfig
from access_management import AccessManagement
from flask_httpauth import HTTPTokenAuth
import logging

app = Flask(__name__)
auth = HTTPTokenAuth(scheme='Bearer')

# Using a development configuration
running_dev = True
app.config.from_object('config.DevConfig' if running_dev else 'config.ProdConfig')

connector_config = ConnectorConfig.config

access = AccessManagement()
access_codes = access.active_access_codes
access_codes.add('testCode')
reflection_token = secrets.token_urlsafe(64)


@auth.verify_token
def verify_token(token):
    return token in access.active_tokens


@app.route('/api/generate', methods=['GET'])
def generate_access_code():
    new_access_code = access.create_new_access_code()
    print(f'\n{access.create_new_access_code()}\n')

    return jsonify('Check console for access code.'), 200


@app.route('/api/token', methods=['POST'])
def get_token():
    request_data = request.get_json()
    access_code = request_data['accessCode']  

    if access_code in access_codes:
        access_codes.pop(access_code)
        new_token = access.create_new_token()
        return jsonify(new_token)
    else:
        return jsonify(''), 401


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
    res = mycursor.fetchall()
    mycursor.close()

    db.close()
    return jsonify(res)


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


def get_matchIDs_in_group(groupID, db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT matchID "
                     f"FROM eventmatches "
                     f"WHERE groupID = {groupID}")

    res = mycursor.fetchall()
    mycursor.close()

    return res


@app.route('/api/system_events/tournaments/groups/matches', methods=['GET'])
def matches_in_group():
    groupID = request.args.get('groupID')
    mydb = mysql.connector.connect(**connector_config)

    matchIDs = get_matchIDs_in_group(groupID, mydb)
    detailed_matches = []
    for ID in matchIDs:
        match = get_specific_match(ID['matchID'], mydb)
        format_match(match, ID['matchID'], mydb)
        detailed_matches.append(match)

    mydb.close()
    return jsonify(detailed_matches)


def get_fighterIDs_in_group(groupID, db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT fighter1ID, fighter2ID "
                     f"FROM eventmatches "
                     f"WHERE groupID = {groupID}")

    res = mycursor.fetchall()
    mycursor.close()

    return res


@app.route('/api/system_events/tournaments/groups/fighters', methods=['GET'])
def fighters_in_group():
    groupID = request.args.get('groupID')
    mydb = mysql.connector.connect(**connector_config)

    fighterIDs = get_fighterIDs_in_group(groupID, mydb)
    fighters = []
    for fighterID in fighterIDs:
        fighter1 = get_fighter_names(fighterID['fighter1ID'], mydb)
        fighter2 = get_fighter_names(fighterID['fighter2ID'], mydb)
        if fighter1 not in fighters:
            fighters.append(fighter1)
        if fighter2 not in fighters:
            fighters.append(fighter2)

    mydb.close()
    return jsonify(fighters)


def get_pools(tournamentID, db):
    select_groupIDs = f'SELECT groupID ' \
                      f'FROM eventgroups ' \
                      f'WHERE tournamentID = {tournamentID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_groupIDs)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_roster(tournamentID, db):
    select_rosterIDs = f'SELECT rosterID ' \
                       f'FROM eventtournamentroster ' \
                       f'WHERE tournamentID = {tournamentID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_rosterIDs)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_system_roster(tournamentID, db):
    select_rosterIDs = f'(SELECT rosterID ' \
                       f'FROM eventtournamentroster ' \
                       f'WHERE tournamentID = {tournamentID})'
    select_system_rosterIDs = f'SELECT rosterID, systemRosterID FROM eventroster WHERE rosterID IN {select_rosterIDs}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_system_rosterIDs)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_matches(tournamentID, db):
    select_groupIDs = f'(SELECT groupID FROM eventgroups WHERE tournamentID = {tournamentID})'
    select_matchIDs = f'SELECT matchID, groupID, matchNumber, fighter1ID, fighter1Score, fighter2ID, fighter2Score ' \
                      f'FROM eventmatches ' \
                      f'WHERE groupID IN {select_groupIDs}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_matchIDs)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_fighters(tournamentID, db):
    select_eventID = f'(SELECT eventID FROM eventtournaments WHERE tournamentID = {tournamentID})'
    select_system_rosterIDs = f'(SELECT systemrosterID FROM eventroster WHERE eventID = {select_eventID})'
    select_fighter_names = f'SELECT firstName, lastName, systemRosterID ' \
                           f'FROM systemroster ' \
                           f'WHERE systemRosterID IN {select_system_rosterIDs}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_fighter_names)
    res = mycursor.fetchall()
    mycursor.close()

    return res


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
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime, matchNumber"
    select_match = f'SELECT {relevantFields} FROM eventmatches WHERE matchID = {matchID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_match)

    res = mycursor.fetchone()
    mycursor.close()
    return res


def get_tournamentID_for_match(matchID, db):
    select_groupID = f'(SELECT groupID FROM eventmatches WHERE matchID = {matchID})'
    select_tournamentID = f'SELECT tournamentID FROM eventgroups WHERE groupID IN {select_groupID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_tournamentID)
    res = mycursor.fetchone()
    mycursor.close()

    return res['tournamentID']


def get_group_match_is_in(matchID, db):
    select_groupID = f'SELECT groupID FROM eventmatches WHERE matchID = {matchID}'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_groupID)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_penalties_for_match(matchID, db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT matchID, exchangeType, scoringID "
                     f"FROM eventexchanges "
                     f"WHERE matchID = {matchID} AND exchangeType = 'penalty'")

    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_warnings_for_match(matchID, db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT matchID, exchangeType, scoringID "
                     f"FROM eventexchanges "
                     f"WHERE matchID = {matchID} AND exchangeType = 'warning'")

    res = mycursor.fetchall()
    mycursor.close()

    return res


@app.route('/api/match', methods=['GET'])
def specific_match():
    matchID = request.args.get('matchID')
    mydb = mysql.connector.connect(**connector_config)

    # use matchID to get a specific match; store details
    match = get_specific_match(matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()

    return jsonify(match)


def format_match(match, matchID, mydb):
    # adds any additional necessary fields for mobile side including tournamentID, number of penalties, warnings

    fighter1ID = match['fighter1ID']
    fighter2ID = match['fighter2ID']

    # penalties = get_penalties_for_match(matchID, mydb)
    # warnings = get_warnings_for_match(matchID, mydb)
    tournamentID = get_tournamentID_for_match(matchID, mydb)
    match['tournamentID'] = tournamentID

    # get the count of penalties and warnings for each fighter only; actual penalty/warnings objects are not needed
    num_penalties_fighter1 = len(get_penalties_for_fighter(matchID, fighter1ID, mydb))
    num_warnings_fighter1 = len(get_warnings_for_fighter(matchID, fighter1ID, mydb))
    num_penalties_fighter2 = len(get_penalties_for_fighter(matchID, fighter2ID, mydb))
    num_warnings_fighter2 = len(get_warnings_for_fighter(matchID, fighter2ID, mydb))

    match['num_penalties_fighter1'] = num_penalties_fighter1
    match['num_warnings_fighter1'] = num_warnings_fighter1
    match['num_penalties_fighter2'] = num_penalties_fighter2
    match['num_warnings_fighter2'] = num_warnings_fighter2

    return match


def increase_score(fighter_number, matchID, db):
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    fighterID_field_name = f'fighter{fighter_number}ID'
    fighterID = f'(SELECT {fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    other_fighter_number = 1 if fighter_number == 2 else 2
    other_fighterID_field_name = f'fighter{other_fighter_number}ID'
    other_fighterID = f'(SELECT {other_fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    mycursor = db.cursor(dictionary=True)

    # for debugging only; resets scores of 0 to null
    # mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = NULL WHERE {fighterNScore} = 0")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = 0 "
                     f"WHERE {fighterNScore} IS NULL")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = {fighterNScore} + 1 "
                     f"WHERE matchID = {matchID}")

    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'increase', {fighterID}, {other_fighterID}, 1)")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    myresult = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return myresult


@app.route('/api/match/increase_score_fighter1', methods=['GET', 'POST'])
@auth.verify_token
def matches_increase_score_fighter1():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        #  increase the score of fighter 1 and store the updated match
        match = increase_score(1, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


@app.route('/api/match/increase_score_fighter2', methods=['GET', 'POST'])
@auth.verify_token
def matches_increase_score_fighter2():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        #  increase the score of fighter 2 and store the updated match
        match = increase_score(2, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def decrease_score(fighter_number, matchID, db):
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    fighterID_field_name = f'fighter{fighter_number}ID'
    fighterID = f'(SELECT {fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    other_fighter_number = 1 if fighter_number == 2 else 2
    other_fighterID_field_name = f'fighter{other_fighter_number}ID'
    other_fighterID = f'(SELECT {other_fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    # get_fighter_score = f"(SELECT {fighterNScore} FROM eventmatches WHERE matchID = {matchID})"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = 0 "
                     f"WHERE {fighterNScore} IS NULL")

    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'decrease', {fighterID}, {other_fighterID}, -1) ")

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET {fighterNScore} = {fighterNScore} - 1 "
                     f"WHERE matchID = {matchID} AND {fighterNScore} > 0")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    res = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return res


@app.route('/api/match/decrease_score_fighter1', methods=['GET', 'POST'])
@auth.verify_token
def matches_decrease_score_fighter1():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        #  decrease the score of fighter 1 and store the updated match
        match = decrease_score(1, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


@app.route('/api/match/decrease_score_fighter2', methods=['GET', 'POST'])
@auth.verify_token
def matches_decrease_score_fighter2():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        #  decrease the score of fighter 2 and store the updated match
        match = decrease_score(2, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def give_warning_to_fighter(fighter_number, matchID, db):
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    fighterID_field_name = f'fighter{fighter_number}ID'
    fighterID = f'(SELECT {fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    other_fighter_number = 1 if fighter_number == 2 else 2
    other_fighterID_field_name = f'fighter{other_fighter_number}ID'
    other_fighterID = f'(SELECT {other_fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'warning', {fighterID}, {other_fighterID}, 0)")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    res = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return res


@app.route('/api/match/warning_fighter1', methods=['GET', 'POST'])
@auth.verify_token
def matches_give_warning_to_fighter1():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)
    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        # give warning to fighter 1 and store updated match
        match = give_warning_to_fighter(1, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


@app.route('/api/match/warning_fighter2', methods=['GET', 'POST'])
@auth.verify_token
def matches_give_warning_to_fighter2():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)
    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        # give warning to fighter 2 and store updated match
        match = give_warning_to_fighter(2, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def give_penalty_to_fighter(fighter_number, matchID, db):
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    fighterID_field_name = f'fighter{fighter_number}ID'
    fighterID = f'(SELECT {fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    other_fighter_number = 1 if fighter_number == 2 else 2
    other_fighterID_field_name = f'fighter{other_fighter_number}ID'
    other_fighterID = f'(SELECT {other_fighterID_field_name} FROM eventmatches WHERE matchID = {matchID})'

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'penalty', {fighterID}, {other_fighterID}, 0)")

    # mycursor.execute(f"SELECT matchID, exchangeType, scoringID, receivingID "
    #                  f"FROM eventexchanges "
    #                  f"WHERE matchID = {matchID} AND exchangeType = 'penalty' "
    #                  f"AND scoringID = {fighterID} AND receivingID = {other_fighterID}")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    res = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return res


@app.route('/api/match/penalty_fighter1', methods=['GET', 'POST'])
@auth.verify_token
def matches_give_penalty_to_fighter1():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        # give penalty to fighter 1 and store updated match
        match = give_penalty_to_fighter(1, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


@app.route('/api/match/penalty_fighter2', methods=['GET', 'POST'])
@auth.verify_token
def matches_give_penalty_to_fighter2():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')

    mydb = mysql.connector.connect(**connector_config)

    if not verify_token(token):
        match = get_specific_match(matchID, mydb)
    else:
        # give penalty to fighter 2 and store updated match
        match = give_penalty_to_fighter(2, matchID, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def set_match_time(matchID, matchTime, db):
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET matchTime = {matchTime} "
                     f"WHERE matchID = {matchID}")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")

    res = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return res


@app.route('/api/match/set_match_time', methods=['GET', 'POST'])
def matches_set_match_time():
    matchID = request.args.get('matchID')
    request_data = request.get_json()
    matchTime = request_data['matchTime']
    mydb = mysql.connector.connect(**connector_config)

    # change match time and store updated match
    match = set_match_time(matchID, matchTime, mydb)
    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def set_scores(matchID, fighter1Score, fighter2Score, db):
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"UPDATE eventmatches "
                     f"SET fighter1Score = {fighter1Score}, fighter2Score = {fighter2Score} "
                     f"WHERE matchID = {matchID}")

    mycursor.execute(f"SELECT {relevantFields} "
                     f"FROM eventmatches "
                     f"WHERE matchID = {matchID}")
    res = mycursor.fetchone()
    db.commit()

    mycursor.close()
    return res


def undo_increase(matchID, scoringID, receivingID, scoreValue, db):
    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'undo-increase', {scoringID}, {receivingID}, {scoreValue}) ")

    db.commit()
    mycursor.close()
    return


def undo_decrease(matchID, scoringID, receivingID, scoreValue, db):
    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"INSERT INTO eventexchanges(matchID, exchangeType, scoringID, receivingID, scoreValue) "
                     f"VALUES ({matchID}, 'undo-decrease', {scoringID}, {receivingID}, {scoreValue}) ")

    db.commit()
    mycursor.close()
    return


def undo_penalty(num_penalties_to_remove, matchID, scoringID, receivingID, _, db):
    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"DELETE FROM eventexchanges "
                     f"WHERE matchID = {matchID} AND exchangeType = 'penalty' "
                     f"AND scoringID = {scoringID} AND receivingID = {receivingID} "
                     f"LIMIT {num_penalties_to_remove}")

    db.commit()
    mycursor.close()
    return


def undo_warning(num_warnings_to_remove, matchID, scoringID, receivingID, _, db):
    mycursor = db.cursor(dictionary=True)

    mycursor.execute(f"DELETE FROM eventexchanges "
                     f"WHERE matchID = {matchID} AND exchangeType = 'warning' "
                     f"AND scoringID = {scoringID} AND receivingID = {receivingID} "
                     f"LIMIT {num_warnings_to_remove}")

    db.commit()
    mycursor.close()
    return


def get_penalties_for_fighter(matchID, scoringID, db):
    select_penalties = f"SELECT matchID, exchangeType, scoringID " \
                       f"FROM eventexchanges " \
                       f"WHERE matchID = {matchID} AND exchangeType = 'penalty' AND scoringID = {scoringID}"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_penalties)
    res = mycursor.fetchall()
    mycursor.close()

    return res


def get_warnings_for_fighter(matchID, scoringID, db):
    select_penalties = f"SELECT matchID, exchangeType, scoringID " \
                       f"FROM eventexchanges " \
                       f"WHERE matchID = {matchID} AND exchangeType = 'warning' AND scoringID = {scoringID}"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(select_penalties)
    res = mycursor.fetchall()
    mycursor.close()

    return res


@app.route('/api/match/undo', methods=['GET', 'POST'])
@auth.verify_token
def matches_handle_undo():
    matchID = request.args.get('matchID')
    token = request.headers.get('Authorization').strip('Bearer ')
    request_data = request.get_json()

    fighter1ID = request_data['fighter1ID']
    fighter1Score = request_data['fighter1Score']
    fighter1Warnings = request_data['fighter1Warnings']
    fighter1Penalties = request_data['fighter1Penalties']

    fighter2ID = request_data['fighter2ID']
    fighter2Score = request_data['fighter2Score']
    fighter2Warnings = request_data['fighter2Warnings']
    fighter2Penalties = request_data['fighter2Penalties']

    mydb = mysql.connector.connect(**connector_config)
    ##########
    # calculate any changes in score that need to be undone
    current_match_state = get_specific_match(matchID, mydb)
    if verify_token(token):
        if current_match_state['fighter1Score'] > fighter1Score:
            change_in_score = fighter1Score - current_match_state['fighter1Score']
            undo_increase(matchID, fighter1ID, fighter2ID, change_in_score, mydb)

        if current_match_state['fighter2Score'] > fighter2Score:
            change_in_score = fighter2Score - current_match_state['fighter2Score']
            undo_increase(matchID, fighter2ID, fighter1ID, change_in_score, mydb)

        if current_match_state['fighter1Score'] < fighter1Score:
            change_in_score = fighter1Score - current_match_state['fighter1Score']
            undo_decrease(matchID, fighter1ID, fighter2ID, change_in_score, mydb)

        if current_match_state['fighter2Score'] < fighter2Score:
            change_in_score = fighter2Score - current_match_state['fighter2Score']
            undo_decrease(matchID, fighter2ID, fighter1ID, change_in_score, mydb)

        ##########
        # calculate if there is a discrepancies in number of penalties
        current_fighter1_penalties = get_penalties_for_fighter(matchID, fighter1ID, mydb)
        current_fighter2_penalties = get_penalties_for_fighter(matchID, fighter2ID, mydb)

        num_penalties_to_remove_fighter1 = len(current_fighter1_penalties) - fighter1Penalties
        if num_penalties_to_remove_fighter1 > 0:
            undo_penalty(num_penalties_to_remove_fighter1, matchID, fighter1ID, fighter2ID, 0, mydb)

        num_penalties_to_remove_fighter2 = len(current_fighter2_penalties) - fighter2Penalties
        if num_penalties_to_remove_fighter2 > 0:
            undo_penalty(num_penalties_to_remove_fighter2, matchID, fighter2ID, fighter1ID, 0, mydb)

        ##########
        # calculate if there is a discrepancies in number of warnings
        current_fighter1_warnings = get_warnings_for_fighter(matchID, fighter1ID, mydb)
        current_fighter2_warnings = get_warnings_for_fighter(matchID, fighter2ID, mydb)

        num_warnings_to_remove_fighter1 = len(current_fighter1_warnings) - fighter1Warnings
        if num_warnings_to_remove_fighter1 > 0:
            undo_warning(num_warnings_to_remove_fighter1, matchID, fighter1ID, fighter2ID, 0, mydb)

        num_warnings_to_remove_fighter2 = len(current_fighter2_warnings) - fighter2Warnings
        if num_warnings_to_remove_fighter2 > 0:
            undo_warning(num_warnings_to_remove_fighter2, matchID, fighter2ID, fighter1ID, 0, mydb)

        match = set_scores(matchID, fighter1Score, fighter2Score, mydb)
    else:   # bad token
        match = current_match_state

    format_match(match, matchID, mydb)

    mydb.close()
    return jsonify(match)


def get_fighter_names(fighterID, db):
    mycursor = db.cursor(dictionary=True)
    systemRosterID = f"(SELECT systemRosterID FROM eventroster WHERE rosterID = {fighterID})"

    mycursor.execute(f"SELECT firstName, lastName "
                     f"FROM systemroster "
                     f"WHERE systemRosterID = {systemRosterID}")

    res = mycursor.fetchone()
    mycursor.close()
    res['fighterID'] = fighterID

    return res


@app.route('/api/fighters', methods=['GET'])
def matches_get_fighters():
    fighterID = request.args.get('fighterID')
    mydb = mysql.connector.connect(**connector_config)
    fighter_names = get_fighter_names(fighterID, mydb)
    mydb.close()
    return jsonify(fighter_names)


if __name__ == '__main__':
    app.run(host='0.0.0.0')

