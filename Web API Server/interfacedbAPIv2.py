import mysql.connector
import flask
from flask import request, jsonify


app = flask.Flask(__name__)
app.config["DEBUG"] = True

connector_config = {        
    'host': "localhost",
    'user': "root",
    'password': "cristina0",
    'database': "ScorecardV5",
    'autocommit': True
}


def get_system_events(db):
    mycursor = db.cursor(dictionary=True)
    mycursor.execute("SELECT eventID, eventName FROM systemevents")
    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/system_events', methods=['GET'])
def system_events():
    mydb = mysql.connector.connect(**connector_config)
    return get_system_events(mydb)


def get_tournaments_in_event(body, db):
    eventID = body['eventID']

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT tournamentID, tournamentWeaponID FROM eventtournaments WHERE eventID = {eventID}")
    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/tournaments', methods=['GET'])
def tournaments_in_event():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return get_tournaments_in_event(body, mydb)


# for debugging: group retrieval - in order to get matches, you have to access groups (pools) first
def get_groups_in_tournament(body, db):
    tournamentID = body['tournamentID']

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT groupID FROM eventgroups WHERE tournamentID = {tournamentID}")
    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/tournament_groups', methods=['GET'])
def groups_in_tournament():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return get_groups_in_tournament(body, mydb)


def get_matches(body, db):
    tournamentID = body['tournamentID']

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"SELECT matchID, fighter1ID, fighter2ID FROM eventmatches WHERE groupID IN (SELECT groupID from eventgroups WHERE tournamentID = {tournamentID})")
    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/matches', methods=['GET'])
def matches_in_tournament():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return get_matches(body, mydb)


def get_specific_match(body, db):
    matchID = body['matchID']
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    mycursor = db.cursor(dictionary=True)
    # mycursor.execute(f"SELECT * FROM eventmatches WHERE matchID = {matchID}")
    mycursor.execute(f"SELECT {relevantFields} FROM eventmatches WHERE matchID = {matchID}")

    myresult = mycursor.fetchall()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/match', methods=['GET'])
def specific_match():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return get_specific_match(body, mydb)


def increase_score(fighter_number, body, db):
    matchID = body['matchID']
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"


    mycursor = db.cursor(dictionary=True)

    # for debugging only; resets scores of 0 to null
    # mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = NULL WHERE {fighterNScore} = 0")

    mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = 0 WHERE {fighterNScore} IS NULL")
    mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = {fighterNScore} + 1 WHERE matchID = {matchID}")
    mycursor.execute(f"SELECT {relevantFields} FROM eventmatches WHERE matchID = {matchID}")
    myresult = mycursor.fetchall()
    db.commit()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/matches/increase_score_fighter1', methods=['GET', 'POST'])
def matches_increase_score_fighter1():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return increase_score(1, body, mydb)


@app.route('/api/matches/increase_score_fighter2', methods=['GET', 'POST'])
def matches_increase_score_fighter2():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return increase_score(2, body, mydb)


def decrease_score(fighter_number, body, db):
    matchID = body['matchID']
    fighterNScore = f"fighter{fighter_number}Score"
    relevantFields = "fighter1ID, fighter1Score, fighter2ID, fighter2Score, groupID, matchID, matchTime"

    mycursor = db.cursor(dictionary=True)
    mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = 0 WHERE {fighterNScore} IS NULL")
    mycursor.execute(f"UPDATE eventmatches SET {fighterNScore} = {fighterNScore} - 1 WHERE matchID = {matchID} AND {fighterNScore} > 0")
    mycursor.execute(f"SELECT {relevantFields} FROM eventmatches WHERE matchID = {matchID}")
    myresult = mycursor.fetchall()
    db.commit()

    mycursor.close()
    db.close()
    return jsonify(myresult)


@app.route('/api/matches/decrease_score_fighter1', methods=['GET', 'POST'])
def matches_decrease_score_fighter1():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return decrease_score(1, body, mydb)


@app.route('/api/matches/decrease_score_fighter2', methods=['GET', 'POST'])
def matches_decrease_score_fighter2():
    body = request.get_json()
    mydb = mysql.connector.connect(**connector_config)
    return decrease_score(2, body, mydb)



app.run(host='0.0.0.0')