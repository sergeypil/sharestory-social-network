package org.sharestory.project.service;

import org.sharestory.project.dto.TopicDto;
import org.sharestory.project.exceptions.SpringSharestoryException;
import org.sharestory.project.model.Topic;
import org.sharestory.project.repository.TopicRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;

import java.time.Instant;

@Service
@AllArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final AuthService authService;

    @Transactional
    public TopicDto save(TopicDto topicDto) {
        Topic save = topicRepository.save(mapToTopic(topicDto));
        topicDto.setId(save.getId());
        return topicDto;
    }

    @Transactional(readOnly = true)
    public List<TopicDto> getAll() {
        return topicRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(toList());
    }

    @Transactional(readOnly = true)
    public TopicDto getTopic(Long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new SpringSharestoryException("No topic found with ID - " + id));
        return mapToDto(topic);
    }
    
    private TopicDto mapToDto (Topic topic) {
        return TopicDto.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .numberOfPosts(topic.getPosts().size())
                .build();
    }
    
    private Topic mapToTopic (TopicDto topicDto) {
        return Topic.builder().name(topicDto.getName())
                .description(topicDto.getDescription())
                .user(authService.getCurrentUser())
                .createdDate(Instant.now())
                .build();

    }
}
