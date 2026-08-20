package com.example.sac_training.auth;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class AuthTokenService {
    private static final long TOKEN_HOURS = 8;
    private final Map<String, TokenEntry> tokens = new ConcurrentHashMap<>();

    public String issue(Integer userId) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenEntry(userId, Instant.now().plus(TOKEN_HOURS, ChronoUnit.HOURS)));
        return token;
    }

    public Optional<Integer> resolve(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) return Optional.empty();
        String token = authorization.substring(7);
        TokenEntry entry = tokens.get(token);
        if (entry == null || entry.expiresAt().isBefore(Instant.now())) {
            tokens.remove(token);
            return Optional.empty();
        }
        return Optional.of(entry.userId());
    }

    public void revoke(String authorization) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            tokens.remove(authorization.substring(7));
        }
    }

    private record TokenEntry(Integer userId, Instant expiresAt) {}
}
