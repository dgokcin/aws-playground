package com.amazonaws.lambda.demo;

import java.util.Map;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class Hello implements RequestHandler<Map<String,String>, String> {
//	public String handleRequest(Map<String,String> input, Context context) {
//	  String greetingMessage = "Hello, " + input.get("Name") + " " + input.get("Surname");
//	  return greetingMessage;
//	}

	public String handleRequest(Map<String,String> input, Context context) {
	  int integer_1 = Integer.parseInt(input.get("int_1"));
	  int integer_2 = Integer.parseInt(input.get("int_2"));
	  
      System.out.println("First integer: " + Integer.toString(integer_1));
      System.out.println("Second integer: " + Integer.toString(integer_2));

	  return "Total is: " + Integer.toString(integer_1 + integer_2);
	}
}
