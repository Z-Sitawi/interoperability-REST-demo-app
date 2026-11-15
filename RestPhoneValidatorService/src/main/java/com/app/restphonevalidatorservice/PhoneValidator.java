package com.app.restphonevalidatorservice;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/phonevalidator")
public class PhoneValidator {

    // Matches: 0612345678, +212612345678, 00212788877722, 0511111111
    private static final String PHONE_REGEX = "^(?:(?:\\+|00)212|0)[5-7]\\d{8}$";
    private static final Pattern PHONE_PATTERN = Pattern.compile(PHONE_REGEX);

    @GET
    @Path("/isvalid")
    @Produces(MediaType.TEXT_PLAIN)
    public Boolean isValid(@QueryParam("pNum") String phone) {
        System.out.println("Validating phone number: " + phone);

        try {
            Thread.sleep(1500);
            if (phone == null || phone.trim().isEmpty()) {
                return false;
            }
            Matcher matcher = PHONE_PATTERN.matcher(phone.replaceAll("\\s+", ""));
            return matcher.matches();

        } catch (Exception e) {
            System.err.println("Error validating phone number: " + e.getMessage());
            return false;
        }
    }
}