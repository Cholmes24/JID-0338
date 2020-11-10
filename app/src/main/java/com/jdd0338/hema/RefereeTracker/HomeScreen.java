package com.jdd0338.hema.RefereeTracker;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class HomeScreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.home_screen);
    }
    public void loadActiveMatch(View view){
        startActivity(new Intent(HomeScreen.this, ActiveMatch.class));
    }

    public void loadUpcomingMatches(View view){
        startActivity(new Intent(HomeScreen.this, UpcomingMatches.class));
    }

}
