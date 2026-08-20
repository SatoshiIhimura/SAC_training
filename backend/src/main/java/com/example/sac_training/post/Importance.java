package com.example.sac_training.post;

public enum Importance {
    HIGH(1),
    MEDIUM(2),
    LOW(3);

    private final int value;

    Importance(int value) {
        this.value = value;
    }

    public int value() {
        return value;
    }

    public static Importance fromValue(int value) {
        for (Importance importance : values()) {
            if (importance.value == value) {
                return importance;
            }
        }
        throw new IllegalArgumentException("未対応のimportanceです: " + value);
    }

    public static Importance fromRequestValue(String value) {
        if (value == null) {
            return null;
        }
        return switch (value.trim()) {
            case "高", "HIGH", "High" -> HIGH;
            case "中", "MEDIUM", "Medium" -> MEDIUM;
            case "低", "LOW", "Low" -> LOW;
            default -> null;
        };
    }
}
