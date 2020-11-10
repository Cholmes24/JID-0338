package com.jdd0338.hema.RefereeTracker;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

public class ActiveMatch extends AppCompatActivity {

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.active_match_screen);
    }
    private void loadUpcomingMatches(){
        startActivity(new Intent(ActiveMatch.this, UpcomingMatches.class));
    }
    private void loadHomeScreen(){
        startActivity(new Intent(ActiveMatch.this, HomeScreen.class));
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.temp_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.upcomingMatch:
                loadUpcomingMatches();
                return true;
            case R.id.homescreen:
                loadHomeScreen();
                return true;
        }
        return true;
    }
}
