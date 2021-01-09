  package org.sharestory.project.controller;

import org.sharestory.project.dto.TopicDto;
import org.sharestory.project.service.TopicService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topic")
@AllArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public ResponseEntity<TopicDto> createTopic(@RequestBody TopicDto topicDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(topicService.save(topicDto));
    }

    @GetMapping
    public ResponseEntity<List<TopicDto>> getAllTopics() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(topicService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicDto> getTopic(@PathVariable Long id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(topicService.getTopic(id));
    }
}
