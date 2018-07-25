package com.reidbackend.demo;

import java.io.*;
import java.lang.*;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReidController {
    @GetMapping("/reid")
    @ResponseBody
    public String getResult() throws IOException
    {
        String command = "python F:\\trial.py";

        // Get a list of all environment variables
        final Map<String, String> envMap = new HashMap<String, String>(System.getenv());

        // Append Python bin path to Path
        envMap.put("Path", envMap.get("Path") + ";E:\\Anaconda");

        // Convert to an array of ENV_KEY=ENV_VALUE format strings
        final String[] envs = new String[envMap.size()];
        int i = 0;
        for (Map.Entry<String, String> e : envMap.entrySet()) {
            envs[i] = e.getKey() + '=' + e.getValue();
            i++;
        }

        // Exec with the environment variables
        Process pr = Runtime.getRuntime().exec(command, envs);
        BufferedReader in = new BufferedReader(new InputStreamReader(pr.getInputStream()));
        String line;
        while ((line = in.readLine()) != null) {
            System.out.println(line);
        }
        in.close();
        //pr.waitFor();
        return line;
    }
}
